import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-900">
            <div className="w-full max-w-md animate-slide-up">
                <Card>
                    <LoginForm />
                </Card>
            </div>
        </div>
    );
}
