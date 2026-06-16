'use client';

import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase-app';
import { toast } from 'sonner';

export function NotificationListener() {
  useEffect(() => {
    const setupNotifications = async () => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted' && messaging) {
          const currentToken = await getToken(messaging, {
            vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // Note: This usually requires a VAPID key from Firebase Settings, but we can try without it or instruct the user later.
          });
          
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            
            // Subscribe to the marketing topic via our Cloud Function
            try {
              await fetch('https://us-central1-adhvaithafoods-7a9a8.cloudfunctions.net/subscribeToTopic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { token: currentToken, topic: 'marketing' } })
              });
              console.log('Successfully subscribed admin to marketing topic!');
            } catch (err) {
              console.error('Failed to subscribe to topic', err);
            }
            
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }
      } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
      }
    };

    setupNotifications();

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        toast(payload.notification?.title || 'New Notification', {
          description: payload.notification?.body,
          icon: '🔔',
          duration: 5000,
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  return null;
}
