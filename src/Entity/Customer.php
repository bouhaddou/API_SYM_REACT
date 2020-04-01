<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 * @ApiResource(
 *      collectionOperations={"get","post"},
 *            itemOperations={"GET","PUT","DELETE"},
 *      subresourceOperations={
 *             "invoces_get_subresource"={"path"="/customers/{id}/invoces"}
 * },
 *      normalizationContext={ "groups"={"customers_read"}}
 *  )
 * @ApiFilter(SearchFilter::class, properties={"firstname":"partial","lastname"})
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoces_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="FirstName est est obligatoire")
     * @Groups({"customers_read", "invoces_read"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom de Famille est est obligatoire")
     * @Groups({"customers_read", "invoces_read"})
     * 
     * 
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Email(
     *     message = "The email '{{ value }}' is not a valid email."
     * )
     * @Assert\NotBlank(message="email  est obligatoire")
     * @Groups({"customers_read", "invoces_read"})
     *
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Invoce", mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource()
     * 
     */
    private $invoces;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customes")
     * @Groups({"customers_read"})
     * @Assert\NotBlank()
     */
    private $user;
    /**
     * permet de récupérer le total des invoces
     * @Groups({"customers_read"})
     * 
     * @return float
     */

    public function getTotaleAmount():float {
        return array_reduce($this->invoces->toArray(),function($total,$invoce){
            return $total + $invoce->getAmount();
        },0);
    }
    /**
     * Récuprer montant total
     * @Groups({"customers_read"})
     */
    public function getUnipayAmount():float {
        return array_reduce($this->invoces->toArray(),function($total,$invoce){
            return $total + ($invoce->getStatus() === "PAID" || $invoce->getStatus() ==="CANCELLED" ? 0 :  $invoce->getAmount());
        },0);
    }

    public function __construct()
    {
        $this->invoces = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoce[]
     */
    public function getInvoces(): Collection
    {
        return $this->invoces;
    }

    public function addInvoce(Invoce $invoce): self
    {
        if (!$this->invoces->contains($invoce)) {
            $this->invoces[] = $invoce;
            $invoce->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoce(Invoce $invoce): self
    {
        if ($this->invoces->contains($invoce)) {
            $this->invoces->removeElement($invoce);
            // set the owning side to null (unless already changed)
            if ($invoce->getCustomer() === $this) {
                $invoce->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
