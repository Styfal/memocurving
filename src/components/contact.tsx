import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          <div className="space-y-6">
            <p>put form here</p>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
