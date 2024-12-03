import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Preview = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Connect Supabase to view saved schedules
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Preview;