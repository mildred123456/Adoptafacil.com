
package com.example.AdoptaFacil.Repository;

import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Entity.Role.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // Buscar un rol por su tipo
    Optional<Role> findByRoleType(RoleType roleType);
}
