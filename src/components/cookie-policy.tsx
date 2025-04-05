import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Cookie Policy
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Last Updated: November 24, 2023
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                1. Cookies and Similar Technologies
              </h2>
              <h3 className="text-lg font-medium mt-4 mb-2">
                1.1 Types of Cookies Employed
              </h3>
              <p>
                We use cookies and similar tracking technologies to collect and use
                personal information about you, including to serve interest-based
                advertising. The types of cookies we use are:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Essential Cookies: Necessary for the operation of the Service,
                  enabling core functionalities such as security, verification, and
                  account management.
                </li>
                <li>
                  Analytics Cookies: Used to understand how users interact with the
                  Service, enabling us to monitor and improve performance.
                </li>
                <li>
                  Third-Party Cookies: Set by third-party services integrated into the
                  Service.
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">
                1.2 Purpose of Cookies
              </h3>
              <p>Cookies are employed for various purposes, including:</p>
              <ul className="list-disc list-inside ml-4">
                <li>
                  Session Management: To maintain your login session and remember
                  your preferences.
                </li>
                <li>
                  Performance Enhancement: To analyze user activity and improve the
                  Service’s performance and reliability.
                </li>
                <li>
                  Functionality: To recognize you when you return to the Service and
                  to personalize content.
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">
                1.3 Management of Cookies
              </h3>
              <p>
                You have the option to control and manage cookies through your
                browser settings. Please be aware that disabling cookies may affect
                the functionality and features of the Service.
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
