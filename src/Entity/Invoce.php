<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoceRepository")
 * @ApiResource(attributes={
 * 
 *    },
 *      normalizationContext={"groups"={"invoces_read"}},
 *      denormalizationContext={"disable_type_enforcement"=true}
 *    )
 * @ApiFilter(OrderFilter::class,properties={"amount"})
 * @ApiFilter(SearchFilter::class,properties={"amount":"partial"})
 */
class Invoce
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoces_read", "customers_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoces_read", "customers_read"})
     * @Assert\NotBlank()
     * @Assert\Type(type="numeric", message=" le montant doit etre number")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoces_read", "customers_read"})
     * @Assert\DateTime()
     * @Assert\NotBlank()
     */
    private $setAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoces_read", "customers_read"})
     * @Assert\NotBlank()
     * @Assert\Choice(choices={"SENT", "PAID" , "CANCELLED"})
     * 
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoces")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoces_read"})
     * @Assert\NotBlank()
     * 
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoces_read"})
     * @Groups({"invoces_read", "customers_read"})
     * @Assert\NotBlank()
     * 
     */
    private $chrono;

    /**
     * permet de recuperer user à qui  appartient finalement la factures
     * @Groups({"invoces_read"})
     * 
     */

    public function getUser() : User {
        return $this->customer->getUser();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount( $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSetAt(): ?\DateTimeInterface
    {
        return $this->setAt;
    }

    public function setSetAt(\DateTimeInterface $setAt): self
    {
        $this->setAt = $setAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?customer
    {
        return $this->customer;
    }

    public function setCustomer(?customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
