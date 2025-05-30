import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { category: string } }
) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate API response
    return NextResponse.json({
        success: true,
        category: params.category,
        message: `Successfully fetched data for ${params.category}`,
        data: {
            trainers: [
                { id: 1, name: 'Trainer 1', expertise: params.category },
                { id: 2, name: 'Trainer 2', expertise: params.category },
            ]
        }
    });
} 