package com.example.AdoptaFacil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Repository.RoleRepository;
import com.example.AdoptaFacil.Repository.PersonRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AdoptaFacilApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdoptaFacilApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(RoleRepository roleRepository, PersonRepository personRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Definir los tipos de roles que se desean crear
			Role.RoleType[] roleTypes = {Role.RoleType.ADMIN, Role.RoleType.CLIENTE, Role.RoleType.ALIADO};
			for (Role.RoleType roleType : roleTypes) {
				// Buscar el rol por tipo, si no existe lo crea y lo guarda
				Role role = roleRepository.findByRoleType(roleType).orElseGet(() -> {
					Role newRole = new Role();
					newRole.setRoleType(roleType);
					return roleRepository.save(newRole);
				});

				// Definir el email para el usuario de ejemplo de cada rol
				String email = roleType.name().toLowerCase() + "@ejemplo.com";
				// Verificar si ya existe un usuario con ese email
				if (personRepository.findByEmail(email).isEmpty()) {
					// Crear el usuario de ejemplo para el rol
					Person person = new Person();
					person.setName("Nombre"); // Nombre de ejemplo
					person.setLastName("Apellido"); // Apellido de ejemplo
					person.setEmail(email); // Email único por rol
					person.setPassword(passwordEncoder.encode("Contra123")); // Contraseña encriptada
					person.setRole(role); // Asignar el rol correspondiente
					personRepository.save(person); // Guardar el usuario en la base de datos
				}
			}
			// Mensaje llamativo de éxito en la terminal
			System.out.println("\n==============================");
			System.out.println("   SEEDERs EJECUTADO CON EXITO!  ");
			System.out.println("   Usuarios y roles iniciales creados   ");
			System.out.println("==============================\n");
		};
	}

}
