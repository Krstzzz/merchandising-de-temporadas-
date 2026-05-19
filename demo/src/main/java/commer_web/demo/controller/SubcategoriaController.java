package commer_web.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.model.Categoria;
import commer_web.demo.model.Subcategoria;
import commer_web.demo.repository.CategoriaRepository;
import commer_web.demo.repository.SubcategoriaRepository;

@RestController
@RequestMapping("/api/subcategorias")
@CrossOrigin(origins = "http://localhost:4200")
public class SubcategoriaController {

    private final SubcategoriaRepository subcategoriaRepository;
    private final CategoriaRepository categoriaRepository;

    public SubcategoriaController(
            SubcategoriaRepository subcategoriaRepository,
            CategoriaRepository categoriaRepository
    ) {
        this.subcategoriaRepository = subcategoriaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Subcategoria> listarSubcategorias() {
        return subcategoriaRepository.findAll();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Subcategoria> listarPorCategoria(@PathVariable Long categoriaId) {
        return subcategoriaRepository.findByCategoriaId(categoriaId);
    }

    @PostMapping
    public Subcategoria crearSubcategoria(@RequestBody SubcategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Subcategoria subcategoria = new Subcategoria();
        subcategoria.setNombre(request.getNombre());
        subcategoria.setCategoria(categoria);

        return subcategoriaRepository.save(subcategoria);
    }

    public static class SubcategoriaRequest {
        private String nombre;
        private Long categoriaId;

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public Long getCategoriaId() {
            return categoriaId;
        }

        public void setCategoriaId(Long categoriaId) {
            this.categoriaId = categoriaId;
        }
    }
}
