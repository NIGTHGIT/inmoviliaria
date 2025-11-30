const fs = require('fs');
const path = require('path');

/**
 * Controlador para subir imágenes usando base64
 */

// Asegurar que exista la carpeta de uploads
const uploadsDir = path.join(__dirname, '../storage/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Subir una imagen (base64)
 */
exports.uploadImage = (req, res) => {
    try {
        const { image, filename } = req.body;
        
        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó ninguna imagen'
            });
        }

        // Extraer el tipo de imagen y los datos base64
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
            return res.status(400).json({
                success: false,
                message: 'Formato de imagen inválido'
            });
        }

        const imageType = matches[1];
        const base64Data = matches[2];
        
        // Validar que sea una imagen
        if (!imageType.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                message: 'El archivo debe ser una imagen'
            });
        }

        // Generar nombre de archivo único
        const ext = imageType.split('/')[1];
        const uniqueName = filename || `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
        const filePath = path.join(uploadsDir, uniqueName);

        // Guardar imagen
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

        // Construir URL de la imagen
        const imageUrl = `/uploads/${uniqueName}`;
        
        res.json({
            success: true,
            message: 'Imagen subida exitosamente',
            url: imageUrl,
            filename: uniqueName
        });
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir la imagen'
        });
    }
};

/**
 * Subir múltiples imágenes (base64)
 */
exports.uploadMultipleImages = (req, res) => {
    try {
        const { images } = req.body;
        
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionaron imágenes'
            });
        }

        const uploadedUrls = [];
        const errors = [];

        images.forEach((imageData, index) => {
            try {
                // Extraer el tipo de imagen y los datos base64
                const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                
                if (!matches || matches.length !== 3) {
                    errors.push(`Imagen ${index + 1}: formato inválido`);
                    return;
                }

                const imageType = matches[1];
                const base64Data = matches[2];
                
                // Validar que sea una imagen
                if (!imageType.startsWith('image/')) {
                    errors.push(`Imagen ${index + 1}: no es una imagen válida`);
                    return;
                }

                // Generar nombre de archivo único
                const ext = imageType.split('/')[1];
                const uniqueName = `img-${Date.now()}-${index}-${Math.round(Math.random() * 1E9)}.${ext}`;
                const filePath = path.join(uploadsDir, uniqueName);

                // Guardar imagen
                fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

                // Agregar URL
                uploadedUrls.push(`/uploads/${uniqueName}`);
            } catch (err) {
                errors.push(`Imagen ${index + 1}: ${err.message}`);
            }
        });

        if (uploadedUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo subir ninguna imagen',
                errors
            });
        }

        res.json({
            success: true,
            message: `${uploadedUrls.length} de ${images.length} imágenes subidas exitosamente`,
            urls: uploadedUrls,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Error subiendo imágenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir las imágenes'
        });
    }
};

/**
 * Eliminar una imagen
 */
exports.deleteImage = (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Imagen eliminada exitosamente'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Imagen no encontrada'
            });
        }
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la imagen'
        });
    }
};
