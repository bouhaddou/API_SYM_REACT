<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreateSubscriber {


public function updateJwtData(JWTCreatedEvent $event )
{
    // recupere l'autisateur 
    $user = $event->getUser();
    $data = $event->getData();
    $data['firstname']= $user->getFirstname();
    $data['lastename']= $user->getLastename();

    $event->setData($data);
    
}



}

?>