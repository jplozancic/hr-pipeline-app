import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Fallback route page component displayed when a route is not matched.
 * Provides a user-friendly 404 message and a quick link back to the application context.
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-[90vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-muted shadow-sm">
        <CardHeader className="pb-4 border-b">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Error 404
          </p>
          <CardTitle className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Page not found
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pb-4">
          <p className="text-base leading-relaxed text-muted-foreground">
            We couldn't find the page you're looking for. The link you followed might 
            be broken, or the page may have been removed. Please check the URL or 
            return to the candidates list.
          </p>
        </CardContent>

        <CardFooter>
          <Button asChild>
            <Link to="/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Candidates
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}