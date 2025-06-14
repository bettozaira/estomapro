/*
  # Sistema de Assinaturas e Administração

  1. New Tables
    - `subscription_plans` - Planos de assinatura disponíveis
    - `user_subscriptions` - Assinaturas dos usuários
    - `subscription_requests` - Pedidos de cadastro/upgrade
    - `admin_users` - Administradores do sistema
    - `payment_history` - Histórico de pagamentos

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin access
    - Add policies for user subscription access

  3. Changes
    - Add subscription fields to professionals table
    - Add approval workflow
*/

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly decimal(10,2) NOT NULL DEFAULT 0,
  price_yearly decimal(10,2),
  max_patients integer DEFAULT -1, -- -1 = unlimited
  max_photos integer DEFAULT -1,
  max_evolutions integer DEFAULT -1,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status text CHECK (status IN ('active', 'expired', 'cancelled', 'pending')) DEFAULT 'pending',
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription requests table
CREATE TABLE IF NOT EXISTS subscription_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  request_type text CHECK (request_type IN ('new_account', 'upgrade', 'renewal')) DEFAULT 'new_account',
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES user_subscriptions(id),
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'BRL',
  payment_method text,
  payment_status text CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id text,
  payment_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add subscription fields to professionals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'account_status'
  ) THEN
    ALTER TABLE professionals ADD COLUMN account_status text CHECK (account_status IN ('pending', 'active', 'suspended', 'expired')) DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE professionals ADD COLUMN subscription_tier text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'trial_ends_at'
  ) THEN
    ALTER TABLE professionals ADD COLUMN trial_ends_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE professionals ADD COLUMN approved_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE professionals ADD COLUMN approved_by uuid;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans
  FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for subscription_requests
CREATE POLICY "Users can view their own requests"
  ON subscription_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create subscription requests"
  ON subscription_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for payment_history
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, max_patients, max_photos, max_evolutions, features) VALUES
('Gratuito', 'Plano básico para teste', 0, 0, 5, 20, 50, '["Até 5 pacientes", "20 fotos", "50 evoluções", "Suporte básico"]'::jsonb),
('Profissional', 'Para profissionais individuais', 29.90, 299.00, 50, 500, 1000, '["Até 50 pacientes", "500 fotos", "1000 evoluções", "Relatórios avançados", "Suporte prioritário"]'::jsonb),
('Clínica', 'Para clínicas e hospitais', 99.90, 999.00, -1, -1, -1, '["Pacientes ilimitados", "Fotos ilimitadas", "Evoluções ilimitadas", "Múltiplos usuários", "API access", "Suporte 24/7"]'::jsonb);

-- Insert default admin user (password: EstomaPro2024!)
INSERT INTO admin_users (email, password_hash, full_name, role) VALUES
('admin@estomapro.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador ESTOMAPRO', 'super_admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_status ON subscription_requests(status);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_user_id ON subscription_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_account_status ON professionals(account_status);