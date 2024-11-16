'use client'

import { useState } from 'react'
import { CheckCircle, Package, CreditCard, Truck, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ConfirmationComponent() {
  const [isLoading, setIsLoading] = useState(false)

  const handlePlaceOrder = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Review your order</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Shipping address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">John Doe</p>
                <p className="text-gray-600">123 Main St, Apt 4B</p>
                <p className="text-gray-600">New York, NY 10001</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Payment method</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">Visa ending in 1234</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Review items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Premium Plan Subscription</h3>
                    <p className="text-gray-600">1-year subscription</p>
                    <p className="text-gray-600">$19.99 / month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-700">Order summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="text-gray-900">$239.88</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping & handling:</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Order total:</span>
                    <span className="text-gray-900">$239.88</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full bg-black hover:bg-blue text-white"
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Place your order
                    </span>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  By placing your order, you agree to Memocurve's privacy notice and conditions of use.
                </p>
              </CardFooter>
            </Card>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Order details</h4>
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Calendar className="h-4 w-4" />
                <span>Recurring payment starts Jul 15, 2023</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
                <Truck className="h-4 w-4" />
                <span>Digital delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}