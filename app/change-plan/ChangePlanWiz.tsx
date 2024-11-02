'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Plan {
  name: string
  price: number
  features: string[]
}

// const plans: Plan[] = [
//   {
//     name: 'Basic',
//     price: 9.99,
//     features: [
//       'Up to 100 conversations/month',
//       'Basic AI responses',
//       'Email support',
//       'Standard response time'
//     ]
//   },
//   {
//     name: 'Pro',
//     price: 29.99,
//     features: [
//       'Unlimited conversations',
//       'Advanced AI responses',
//       'Priority support',
//       'Faster response time',
//       'Custom AI training'
//     ]
//   },
//   {
//     name: 'Enterprise',
//     price: 99.99,
//     features: [
//       'Everything in Pro',
//       'Dedicated account manager',
//       'Custom integration',
//       'API access',
//       'SLA guarantee',
//       'Advanced analytics'
//     ]
//   }
// ]

export default function ChangePlanForm() {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [action, setAction] = useState<'upgrade' | 'downgrade' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>('Failed to fetch your current plan. Please try again.')

  function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  async function getKeyMaterial(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  async function deriveKey(keyMaterial: CryptoKey, salt: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const saltBuffer = enc.encode(salt);
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }


  async function decryptToken(encryptedTokenWithIv: string): Promise<string> {
    const [ivHex, authTagHex, encryptedHex] = encryptedTokenWithIv.split(':');
  
    const iv = hexStringToArrayBuffer(ivHex);
    const authTag = hexStringToArrayBuffer(authTagHex);
    const encrypted = hexStringToArrayBuffer(encryptedHex);
  
    // Combine encrypted data and auth tag
    const ciphertext = new Uint8Array(encrypted.byteLength + authTag.byteLength);
    ciphertext.set(new Uint8Array(encrypted), 0);
    ciphertext.set(new Uint8Array(authTag), encrypted.byteLength);
  
    // Derive the key using PBKDF2
    const password = "ConvoAI@2096";
    const salt = "ConvoSalty@2096";
  
    const keyMaterial = await getKeyMaterial(password);
    const key = await deriveKey(keyMaterial, salt);
  
    // Decrypt the ciphertext
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        ciphertext
      );
  
      const decoder = new TextDecoder();
      const decryptedToken = decoder.decode(decrypted);
      return decryptedToken;
    } catch (e) {
      console.error("Decryption failed", e);
      throw new Error("Decryption failed");
    }
  }

  const fetchCurrentPlan = async (token: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('https://aipoool-convoai-backend.onrender.com/api/current-plan', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch current plan')
      
      const data = await response.json()
      console.log(data); 
      setCurrentPlan(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Failed to fetch your current plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessionData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedTokenWithIv = urlParams.get('token');

    if (encryptedTokenWithIv) {
      try {
        const jwtToken = await decryptToken(encryptedTokenWithIv);
        // const tokenData = decodeJwtToken(jwtToken);
        if (jwtToken) {
          fetchCurrentPlan(jwtToken);
        }
      } catch (error) {
        console.error("Failed to decrypt token:", error);
      }
    }
  };

  useEffect(() => {
    fetchSessionData();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your plan details...</p>
      </div>
    )
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnimatePresence mode="wait">
        {!currentPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Current Plan Details</CardTitle>
                <CardDescription>Review your current plan details before making changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Plan Name</Label>
                  <p className="text-2xl font-semibold text-muted-foreground">--</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Price</Label>
                  <p className="text-2xl font-semibold text-muted-foreground">$/month</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Features</Label>
                  <div className="text-muted-foreground">Loading features...</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button disabled>Next</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Action</CardTitle>
                <CardDescription>Would you like to upgrade or downgrade your plan?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={action || ''} 
                  onValueChange={(value) => setAction(value as 'upgrade' | 'downgrade')}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="upgrade" id="upgrade" />
                    <Label 
                      htmlFor="upgrade" 
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Upgrade Plan
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="downgrade" id="downgrade" />
                    <Label 
                      htmlFor="downgrade" 
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Downgrade Plan
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="min-w-[100px]"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => router.push(`/change-plan/${action}`)}
                  disabled={!action}
                  className="min-w-[100px]"
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}