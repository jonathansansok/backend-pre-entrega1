# API CONTAINER

Se va a manejar el módulo fs para poder reescribir el archivos _productos.json_ en la carpeta raiz del repositorio.
Los métodos que se van a utilizar se van a encargar de las validaciones y la reescritura de este archivo.

```javascript
const fs = require("fs")
```

## Métodos

Todos los métodos estarán incluidos en la clase Container, cuyo constructor recibe como parámetro el archivo json de productos.

### Save -

- Recibe un objeto, lo guarda en el archivo y devuelve el id asignado

```javascript
class Container {
  constructor(file) {
    this.file = file;
  }

  async save(object) {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      // * ¿El producto ya existe en el archivo?
      // Se va a buscar al archivo que tenga el mismo nombre
      const productFound = dataParsed.find(
        ({ title }) => title === object.title
      );

      if (productFound) {
        // * Si el producto ya existe, lo retorna
        return null;
      } else {
        // * Si no existe, lo agrega y retorna el objeto con id asignado
        object.id = dataParsed.length + 1;
        dataParsed.push(object);
        // * Al nuevo archivo se le da un formato de json con sus espacios y se sobreescribe en el archivo con writeFile
        const updatedFile = JSON.stringify(dataParsed, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        return object;
      }
    } catch (error) {
      //? Handler error
      console.error(`Se produjo un error en save:${error}`);
    }
  }
}
```

### Update

- Recibe un id y modifica el objeto con ese id, por un nuevo objeto ingresado

```javascript
class Container {
  constructor(file) {
    this.file = file;
  }

  // ? Recibe un id y modifica el objeto con ese id, por un nuevo objeto ingresado

  async update(idEntered, object) {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      // * Se filtran los productos que no cumplen las condiciones (coincidir con el id proporcionado)
      const leakedID = dataParsed.filter(({ id }) => id != idEntered);
      // * Encuentra el producto con el id proporcionado
      const productFound = dataParsed.find(({ id }) => id == idEntered);

      if (productFound) {
        // * Encuentra el archivo y lo actualiza. Lo agrega al array en donde se filtlaron los productos diferentes al id ingresado
        const productFound = { ...object, id: idEntered };
        leakedID.push(productFound);
        // * Se actualiza el archivo
        const updatedFile = JSON.stringify(leakedID, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        console.log(`Producto ${idEntered} modificado con éxito`, productFound);
        // * Retorna el producto que se va a actualizar
        return productFound;
      } else {
        // * Si no encuentra el producto, retorna null - (Este valor permitirá al método put enviar un mensaje al cliente sobre que no se ha encontrado el producto)
        return null;
      }
    } catch (error) {
      // * Handler error
      console.error(`Se produjo un error en saveById:${error}`);
    }
  }
}
```

### Get By Id y Get All

- Buscará todos los productos en el archivo, y también permite filtrar producto por producto, a través de un id

```javascript
class Container {
  constructor(file) {
    this.file = file;
  }

  async getById(idEntered) {
    // ? Recibe un id y devuelve el objeto con ese id, o null si no está

    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      // * ¿El producto ya existe en el archivo?
      const idFound = dataParsed.find(({ id }) => id == idEntered);

      if (idFound) {
        // * Si el producto ya existe, lo devuelve
        console.log(`Se obtuvo el producto ${idFound.title}`);
        return idFound;
      } else {
        // * Si no existe, retorna un mensaje
        console.log("No se han encontrado productos");
      }
    } catch (error) {
      // * Handler error
      console.error(`Se produjo un error en getByID: ${error}`);
    }
  }

  async getAll() {
    // ? Devuelve un array con los objetos presentes en el archivo

    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);

      if (dataParsed.length > 0) {
        // * Si el array contiene elementos, lo retorna
        return dataParsed;
      } else {
        // * Si no contiene, envía un mensaje a la consola
        console.log("No hay elementos disponibles");
      }
    } catch (error) {
      // * Handler error
      console.error(`Se ha producido un error en getAll: ${error}`);
    }
  }
}
```


### Delete By Id y Delete All

- Eliminará todos los productos en el archivo, y también permite filtrar producto por producto, y eliminarlo a través de un id

```javascript
class Container {
  constructor(file) {
    this.file = file;
  }

async deleteById(idEntered) {
    // ? Elimina del archivo el objeto con el Id buscado
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      // * Se filtran los productos que no cumplen las condiciones (coincidir con el id proporcionado)
      const leakedID = dataParsed.filter(({ id }) => id != idEntered);
      // * Encuentra el producto con el id proporcionado
      const idFound = dataParsed.find(({ id }) => id == idEntered);

      if (idFound) {
        // * Si encuentra el producto con el id proporcionado, lo retorna pero antes actualiza el archivo con el array proporcionado con el metodo filter()  -- LEAKEDID
        console.log(
          `Se ha eliminado el objeto con id:${idEntered} >> [[${idFound.title}]]`
        );
        // * Se actualiza el archivo
        const updatedFile = JSON.stringify(leakedID, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        return idFound;
      } else {
        // * Si no existe, envía un mensaje a la consola
        console.log(`No se ha encontrado el objeto con id: ${idEntered}`);
      }
    } catch (error) {
      // * Handler error
      console.error(`Se ha producido un error en deleteById: ${error}`);
    }
  }

  async deleteAll() {
    // ? Elimina todos los objetos presentes en el archivo
    try {
      console.log("Todos los objetos fueron eliminados");
      // * Borrado de todos los objetos (Se sobreescribe el archivo a un array vacío)
      await fs.promises.writeFile(this.file, "[]");
    } catch (error) {
      // * Handler Error
      console.error(`Se ha producido un error en deleteAll: ${error}`);
    }
  }
}

```
