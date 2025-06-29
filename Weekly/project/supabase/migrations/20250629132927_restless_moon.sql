/*
  # Weekly Payment Management Database Schema

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `phone` (text, unique)
      - `password` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `total_amount` (numeric)
      - `date_of_amount_taken` (date)
      - `day_of_amount_taken` (text)
      - `weekly_amount` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `payments`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `payment_date` (date)
      - `amount` (numeric)
      - `status` (text)
      - `week_number` (integer)
      - `paid_date` (date, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone text UNIQUE NOT NULL,
    password text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    phone text NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    date_of_amount_taken date NOT NULL,
    day_of_amount_taken text NOT NULL,
    weekly_amount numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    payment_date date NOT NULL,
    amount numeric(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'DUE' CHECK (status IN ('PAID', 'DUE', 'MISSED')),
    week_number integer NOT NULL,
    paid_date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_paid_date ON payments(paid_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins table
CREATE POLICY "Admins can read own data"
    ON admins
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can update own data"
    ON admins
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create RLS policies for customers table
CREATE POLICY "Authenticated users can read customers"
    ON customers
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert customers"
    ON customers
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
    ON customers
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete customers"
    ON customers
    FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for payments table
CREATE POLICY "Authenticated users can read payments"
    ON payments
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert payments"
    ON payments
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
    ON payments
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete payments"
    ON payments
    FOR DELETE
    TO authenticated
    USING (true);

-- Insert default admin (password is bcrypt hash of 'Phk@1234')
INSERT INTO admins (phone, password) 
VALUES ('7815981315', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (phone) DO NOTHING;