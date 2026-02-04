CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS content_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    input_data JSONB NOT NULL,
    output_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN content_generations.input_data IS 'JSON containing theme, context, audience, etc.';
COMMENT ON COLUMN content_generations.output_data IS 'JSON returned by the agent containing titles, lede, body, etc.';
