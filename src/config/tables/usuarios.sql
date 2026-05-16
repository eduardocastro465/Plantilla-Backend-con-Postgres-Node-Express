CREATE TABLE IF NOT EXISTS tblUsuarios (
    id          SERIAL PRIMARY KEY,
    foto        TEXT,
    usuario     VARCHAR(30) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    activo      BOOLEAN DEFAULT TRUE,
    rol_id      INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES tblRoles(id)
);

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON tblUsuarios;
CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON tblUsuarios
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─── Perfil ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tblPerfil_usuarios (
    id               SERIAL PRIMARY KEY,
    usuario_id       INT NOT NULL,
    nombre           VARCHAR(30) NOT NULL,
    apellido         VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero           VARCHAR(20) ,
    telefono         VARCHAR(20),
    pais             VARCHAR(60) ,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_perfil_usuario FOREIGN KEY (usuario_id) REFERENCES tblUsuarios(id) ON DELETE CASCADE
);

DROP TRIGGER IF EXISTS trg_perfil_updated_at ON tblPerfil_usuarios;
CREATE TRIGGER trg_perfil_updated_at
BEFORE UPDATE ON tblPerfil_usuarios
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─── Dispositivos ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tblDispositivos (
    id               SERIAL PRIMARY KEY,
    usuario_id       INT NOT NULL,
    dispositivo      VARCHAR(30) NOT NULL,
    tipo_dispositivo VARCHAR(30) NOT NULL,
    navegador        TEXT NOT NULL,
    ip_address       VARCHAR(45),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_dispositivo_usuario FOREIGN KEY (usuario_id) REFERENCES tblUsuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_dispositivos_usuario_id ON tblDispositivos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_dispositivos_tipo        ON tblDispositivos(tipo_dispositivo);