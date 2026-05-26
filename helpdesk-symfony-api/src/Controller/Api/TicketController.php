<?php

namespace App\Controller\Api;

use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class TicketController
{
    #[OA\Get(
        path: '/api/tickets',
        summary: 'Listar tickets (protegido por JWT)',
        security: [['Bearer' => []]],
        tags: ['Tickets']
    )]
    #[OA\Response(response: 200, description: 'Listado de tickets')]
    #[Route('/api/tickets', name: 'api_tickets_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return new JsonResponse([
            'items' => [],
            'message' => 'Endpoint listo para conectar con Doctrine ORM.',
        ]);
    }
}
