const fs = require('fs');
const path = require('path');

/**
 * Simulador de localStorage para el backend
 * Guarda datos en archivos JSON
 */
class LocalStorage {
    constructor() {
        this.storageDir = path.join(__dirname, '../storage');
        this.ensureStorageDir();
    }

    ensureStorageDir() {
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
        }
    }

    getFilePath(key) {
        return path.join(this.storageDir, `${key}.json`);
    }

    setItem(key, value) {
        try {
            const filePath = this.getFilePath(key);
            const data = typeof value === 'string' ? value : JSON.stringify(value);
            fs.writeFileSync(filePath, data, 'utf8');
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    }

    getItem(key) {
        try {
            const filePath = this.getFilePath(key);
            if (!fs.existsSync(filePath)) {
                return null;
            }
            const data = fs.readFileSync(filePath, 'utf8');
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        } catch (error) {
            console.error('Error leyendo de localStorage:', error);
            return null;
        }
    }

    removeItem(key) {
        try {
            const filePath = this.getFilePath(key);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return true;
        } catch (error) {
            console.error('Error eliminando de localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            const files = fs.readdirSync(this.storageDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(this.storageDir, file));
            });
            return true;
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
            return false;
        }
    }
}

module.exports = new LocalStorage();
