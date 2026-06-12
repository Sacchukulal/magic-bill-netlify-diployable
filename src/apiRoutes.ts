import express from "express";
import Razorpay from "razorpay";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import cors from "cors";

export const apiRouter = express.Router();

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim().replace(/^["']|["']$/g, '');
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim().replace(/^["']|["']$/g, '');
  
  if (!key_id || !key_secret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are missing.");
  }
  
  return new (Razorpay as any)({
    key_id,
    key_secret,
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyAXx8FYkKjxeYuFUudPFVvDk4DlR25kXt0",
  authDomain: "magicbill-ca26f.firebaseapp.com",
  projectId: "magicbill-ca26f",
  storageBucket: "magicbill-ca26f.firebasestorage.app",
  messagingSenderId: "844678275077",
  appId: "1:844678275077:web:fdd855a85a8a49f5887c6c"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);

const createOrGetPlan = async (internalId: string, amount: number, period: string) => {
  try {
    const plans = await getRazorpay().plans.all();
    const existing = plans.items.find((p: any) => p.item.name === internalId && p.item.amount === amount * 100);
    if (existing) {
      return existing.id;
    }

    const newPlan = await getRazorpay().plans.create({
      period: period as any,
      interval: 1,
      item: {
        name: internalId,
        amount: amount * 100,
        currency: "INR",
        description: `Magicbill ${internalId}`
      }
    });
    return newPlan.id;
  } catch (error: any) {
    console.error("Error creating plan:", error, error?.error);
    if (error?.statusCode === 401) {
      throw new Error("Razorpay authorization failed. The key_id/key_secret are invalid.");
    }
    throw error;
  }
};

apiRouter.use(cors()); // Allow requests if they happen from different origin

apiRouter.post("/subscription/create", async (req, res) => {
  try {
    const { planId, uid } = req.body;
    let rzpPlanId = '';
    let totalCount = 120;

    if (planId === 'tier-monthly') {
      rzpPlanId = await createOrGetPlan('tier-monthly', 299, 'monthly');
    } else if (planId === 'tier-yearly') {
      rzpPlanId = await createOrGetPlan('tier-yearly', 2999, 'yearly');
      totalCount = 10;
    } else {
      return res.status(400).json({ error: "Invalid plan type. Notes: Daily subscriptions require minimum interval of 7 days in Razorpay." });
    }

    const subscription = await getRazorpay().subscriptions.create({
      plan_id: rzpPlanId,
      customer_notify: 1,
      total_count: totalCount,
      notes: {
        uid,
        planId
      }
    });

    res.json({ ...subscription, rzp_client_key_id: process.env.RAZORPAY_KEY_ID?.trim().replace(/^["']|["']$/g, '') });
  } catch (error: any) {
    console.error("Subscription create error:", error);
    if (error?.statusCode === 401 || error?.message?.includes("authorization failed")) {
      return res.status(401).json({ error: "Razorpay authorization failed. The key_id/key_secret are invalid.", details: error });
    }
    res.status(500).json({ error: error.message || (error.error ? error.error.description || error.error.reason : "Failed to create subscription"), details: error });
  }
});

apiRouter.post("/subscription/cancel", async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const result = await getRazorpay().subscriptions.cancel(subscriptionId);
    res.json(result);
  } catch (error) {
    console.error("Subscription cancel error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

apiRouter.post("/webhooks/razorpay", async (req, res) => {
  const payload = req.body;
  const event = payload.event;
  console.log("Received Webhook Event:", event);
  
  try {
    if (event.startsWith("subscription.")) {
      const subscription = payload.payload.subscription.entity;
      const uid = subscription.notes?.uid;
      
      if (uid) {
        const updateData: any = {
          "subscription.status": subscription.status,
          "subscription.id": subscription.id,
          "subscription.updatedAt": new Date().toISOString(),
          "subscription.nextBillingDate": subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
          "subscription.planId": subscription.notes?.planId
        };
        
        await updateDoc(doc(db, "users", uid), updateData);
        console.log(`Updated subscription status for user: ${uid} to ${subscription.status}`);
      }
    } else if (event === "payment.failed") {
      const payment = payload.payload.payment.entity;
      console.log("Payment failed for:", payment.id);
    }
    
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(200).json({ error: "Webhook processed with errors" });
  }
});
