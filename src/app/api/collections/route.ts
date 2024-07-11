import {PrismaClient} from '@prisma/client';
export async function GET(request: Request) {
    const prisma = new PrismaClient();
    const collections = await prisma.collections.findMany();
    return Response.json({collections: collections});
}

export async function POST(request: Request) {
    const body = request.json();

    return new Response('OK');
}
