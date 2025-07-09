import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href="mailto:info@example.com" className="text-lg hover:text-primary transition-colors">
                info@example.com
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                We&apos;ll respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href="tel:+15551234567" className="text-lg hover:text-primary transition-colors">
                +1 (555) 123-4567
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">123 Main Street</p>
              <p className="text-lg">New York, NY 10001</p>
              <p className="text-lg">United States</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 5:00 PM</p>
                <p><span className="font-medium">Saturday:</span> 10:00 AM - 2:00 PM</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Have a question or need assistance? We&apos;re here to help! Reach out to us using any of the contact methods above, 
              and our team will get back to you as soon as possible.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}