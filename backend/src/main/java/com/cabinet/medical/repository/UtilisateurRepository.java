package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    List<Utilisateur> findByRole(Utilisateur.Role role);
    List<Utilisateur> findByActifTrue();
    
    long countByRoleIn(List<Utilisateur.Role> roles);
    
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.cabinet.id = :cabinetId AND u.role = :role")
    long countByCabinetIdAndRole(@Param("cabinetId") Long cabinetId, @Param("role") Utilisateur.Role role);
    
    @Query("SELECT u FROM Utilisateur u WHERE u.role IN (:roles) ORDER BY u.dateCreation DESC")
    List<Utilisateur> findByRoleInOrderByDateCreationDesc(@Param("roles") List<Utilisateur.Role> roles);
    
    @Query("SELECT u FROM Utilisateur u WHERE u.role IN (:roles) AND (u.nom LIKE %:search% OR u.prenom LIKE %:search% OR u.email LIKE %:search%) ORDER BY u.dateCreation DESC")
    List<Utilisateur> searchByRolesAndKeyword(@Param("roles") List<Utilisateur.Role> roles, @Param("search") String search);
}
