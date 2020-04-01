<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Invoce;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Invoce|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoce|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoce[]    findAll()
 * @method Invoce[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoce::class);
    }
    public function findNextChrono(User $user)
    {
        return $this->createQueryBuilder("i")
                    ->select("i.chrono")
                    ->join("i.customer","c")
                    ->where("c.user = :user")
                    ->setParameter("user", $user)
                    ->orderBy("i.chrono","DESC")
                    ->setMaxResults(1)
                    ->getQuery()
                    ->getSingleScalarResult() + 1 ;
    }

    // /**
    //  * @return Invoce[] Returns an array of Invoce objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Invoce
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
