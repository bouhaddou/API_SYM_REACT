<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;

use App\Entity\Invoce;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder=$encoder;
    }
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');
       
       
        for($b=0; $b < 10; $b++)
        { 
          
            $user =new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user,"password");
            $user->setFirstname($faker->firstName)
                 ->setLastename($faker->lastName)
                 ->setPassword($hash)
                 
                 ->setEmail($faker->email);
            $manager->persist($user);

            for($i=0;$i<12;$i++)
            {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName)
                            ->setLastName($faker->lastName)
                            ->setCompany($faker->slug())
                            ->setEmail($faker->email)
                            ->setUser($user);
                    $manager->persist($customer);

                    for($c=0;$c< mt_rand(0,10);$c++)
                    {
                        $invoice = new Invoce();
                        $invoice->setAmount($faker->randomFloat(2,250,5000))
                                ->setSetAt($faker->dateTimeBetween('-6 months'))
                                ->setStatus($faker->randomElement(['SENT', 'PAID' , 'CANCELLED']))
                                ->setCustomer($customer)
                                ->setChrono($chrono);
                                $chrono++;
                        $manager->persist($invoice);
                    }
            }
        }
        $manager->flush();
    }
}
