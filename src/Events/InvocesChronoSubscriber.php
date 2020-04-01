<?php

namespace App\Events;

use App\Entity\Invoce;
use App\Repository\InvoceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvocesChronoSubscriber implements EventSubscriberInterface
{
    private $securite;
    private $repository;
    public function __construct(Security $securite,InvoceRepository $repository)
    {
        $this->securite = $securite;
        $this->repository = $repository;
    }
    public static function getSubscribedEvents()
    {
        return[
            KernelEvents::VIEW =>['setChronoForInvoce',EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoce( GetResponseForControllerResultEvent $event)
    {
        
        $invoce= $event->getControllerResult();
        $methode= $event->getRequest()->getMethod();

        if($invoce instanceof Invoce && $methode === 'POST')
        {
            $nextchrono = $this->repository->findNextChrono($this->securite->getUser());
            $invoce->setChrono($nextchrono);

            if(empty($invoce->getSetAt()))
            {
                $invoce->setSetAt(new \DateTime());
            }
            
        }
        
        
    }


}
?>