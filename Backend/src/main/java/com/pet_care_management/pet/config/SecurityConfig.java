package com.pet_care_management.pet.config;

import java.util.Arrays;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.pet_care_management.pet.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final ObjectProvider<JwtAuthenticationFilter> jwtAuthenticationFilterProvider;

    public SecurityConfig(ObjectProvider<JwtAuthenticationFilter> jwtAuthenticationFilterProvider) {
        this.jwtAuthenticationFilterProvider = jwtAuthenticationFilterProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/contacts/create").permitAll()
                .requestMatchers("/api/contacts/**").hasAnyAuthority("admin", "doctor")
                .requestMatchers("/api/reviews/{reviewId}").permitAll()
                .requestMatchers("/api/reviews/service/**").permitAll()
                .requestMatchers("/api/appointments/booked").permitAll()
                .requestMatchers("/api/appointments/create").authenticated()
                .requestMatchers("/api/appointments/user/**").authenticated()
                .requestMatchers("/api/appointments/{id}/cancel").authenticated()
                .requestMatchers("/api/appointments/admin/**").hasAnyAuthority("admin", "doctor")
                .requestMatchers("/api/services").permitAll()
                .requestMatchers("/api/services/{id}").permitAll()
                .requestMatchers("/api/services/**").hasAuthority("admin")
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/orders/**").permitAll()
                .requestMatchers("/api/cart/**").permitAll()
                .requestMatchers("/api/pets/image/**").permitAll()
                .requestMatchers("/api/pets/**").authenticated()
                .requestMatchers("/api/users/ids").permitAll()
                .requestMatchers("/api/users").permitAll()
                .requestMatchers("/api/users/**").hasAuthority("admin")
                .requestMatchers("/api/albums/image/**").permitAll()
                .requestMatchers("/api/albums/all").permitAll()
                .requestMatchers("/api/albums/{id}").permitAll()
                .requestMatchers("/api/albums/gallery").permitAll()
                .requestMatchers("/api/blogs").permitAll()
                .requestMatchers("/api/blogs/{id}").permitAll()
                .requestMatchers("/api/blogs/**").hasAnyAuthority("admin", "doctor")
                .requestMatchers("/api/chat/**").authenticated()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/chat-test.html").permitAll()
                .requestMatchers("/sockjs-node/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilterProvider.getIfAvailable(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}