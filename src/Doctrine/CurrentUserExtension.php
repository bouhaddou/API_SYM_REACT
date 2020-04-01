<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Customer;
use App\Entity\Invoce;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface,QueryItemExtensionInterface {

    private $secuite;
    private $auth;
    public function __construct(Security $securite,AuthorizationCheckerInterface $cheker)
    {
        $this->secuite = $securite;
        $this->auth = $cheker;
    }
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        $user = $this->secuite->getUser();
        if((
            $resourceClass === Customer::class || $resourceClass === Invoce::class) 
             &&   !$this->auth->isGranted('ROLE_ADMIN') 
             && $user instanceof User)
        {
            $rootAlias = $queryBuilder->getRootAliases()[0];
            if($resourceClass === Customer::class)
            {
                $queryBuilder->andWhere("$rootAlias.user = :user");

            }else if($resourceClass === Invoce::class)
            {
                $queryBuilder->join("$rootAlias.customer","c")
                              ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
          
        }
    }
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder,$resourceClass);
    }
    public function applyToItem(QueryBuilder $queryBuilder,QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder,$resourceClass);
    }

}

?>