package com.example.AdoptaFacil.Implement;

import com.example.AdoptaFacil.DTO.RoleDTO;
import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Repository.RoleRepository;
import com.example.AdoptaFacil.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    // 🔹 Convertir Entity a DTO
    private RoleDTO convertToDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setIdRole(role.getIdRole());
        dto.setRoleType(role.getRoleType());
        return dto;
    }

    // 🔹 Convertir DTO a Entity
    private Role convertToEntity(RoleDTO dto) {
        Role role = new Role();
        role.setIdRole(dto.getIdRole());
        role.setRoleType(dto.getRoleType());
        return role;
    }

    @Override
    public List<RoleDTO> listRoles() {
        return roleRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(Long idRole) {
        return roleRepository.findById(idRole)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public RoleDTO createRole(RoleDTO roleDTO) {
        Role saved = roleRepository.save(convertToEntity(roleDTO));
        return convertToDTO(saved);
    }

    @Override
    public RoleDTO updateRole(Long idRole, RoleDTO roleDTO) {
        Optional<Role> existingRole = roleRepository.findById(idRole);
        if (existingRole.isPresent()) {
            Role role = existingRole.get();
            role.setRoleType(roleDTO.getRoleType());
            Role updated = roleRepository.save(role);
            return convertToDTO(updated);
        }
        return null;
    }

    @Override
    public RoleDTO getRoleByType(Role.RoleType roleType) {
        return roleRepository.findByRoleType(roleType)
                .map(this::convertToDTO)
                .orElse(null);
    }
}
