<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;

use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class CustomerUserSubscriber implements EventSubscriberInterface{

    private $securite;
    public function __construct(Security $securite)
    {
        $this->securite=$securite;
    }
    public static function getSubscribedEvents()
    {
        return[
            KernelEvents::VIEW =>['setUserForCustomer',EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer( GetResponseForControllerResultEvent $event)
    {
        $customer= $event->getControllerResult();
        $methode= $event->getRequest()->getMethod();
        
        if($customer instanceof Customer && $methode === 'POST')
        {
            // choper l'utilisateur actualement
            $user=$this->securite->getUser();
            // asigner l'utilisateur
            $customer->setUser($user);
        }
        
    }
}
?>