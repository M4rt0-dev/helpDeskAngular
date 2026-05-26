<?php

namespace App\Controller;

use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class HealthController
{
    #[OA\Get(
        path: '/api/health',
        summary: 'Health check del backend',
        tags: ['System']
    )]
    #[OA\Response(response: 200, description: 'API operativa')]
    #[Route('/api/health', name: 'api_health', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'service' => 'helpdesk-symfony-api',
        ]);
    }
}
