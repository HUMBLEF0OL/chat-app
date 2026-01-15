import { Card } from '@/components/ui/Card';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-900">
            <div className="w-full max-w-md animate-slide-up">
                <Card>
                    <SignupForm />
                </Card>
            </div>
        </div>
    );
}
