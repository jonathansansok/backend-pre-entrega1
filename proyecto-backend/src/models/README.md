# API CONTAINER

Se va a manejar el módulo fs para poder reescribir el archivos _products.json_ en la carpeta db del repositorio.
Los métodos que se van a utilizar se van a encargar de las validaciones y la reescritura de este archivo.

```javascript
const fs = require("fs");
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

# CART model

Se va a manejar el módulo fs para poder reescribir el archivos _cart.json_ en la carpeta db del repositorio.
Los métodos que se van a utilizar se van a encargar de las validaciones y la reescritura de este archivo.

## Métodos

Todos los métodos estarán incluidos en la clase Cart, cuyo constructor recibe como parámetro el archivo json de productos. Añade, además, un array vació para persistencia de productos por cada carrito y un timestamp. (Creación de carrito)

### newCart -

- Crea un nuevo carrito, y devuelve su id

```javascript
class Cart {
  constructor(file) {
    this.file = file;
    this.products = [];
    this.date = new Date().toLocaleString();
  }

  async newCart() {
    try {
      //! Lectura del archivo principal
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      //! Creación de nuevo carrito
      const newCart = {
        id: dataParsed.length + 1,
        timestamp: this.date,
        products: this.products,
        total: 0,
      };
      //! Se agrega al archivo principal el nuevo carro creado
      dataParsed.push(newCart);
      //! Se prepara el texto para reescribir en el archivo
      const updatedFile = JSON.stringify(dataParsed, null, " ");
      fs.promises.writeFile(this.file, updatedFile);
      //! Retorna el carro creado, desde el controlador extraemos el id del carro, y los productos que posee
      return newCart;
    } catch (error) {
      //! Error Handler
      console.error(`Se produjo un error en newCart:${error}`);
    }
  }
}
```

### deleteCartById -

- Vacía un carrito, y lo elimina.

```javascript
class Cart {
  constructor(file) {
    this.file = file;
    this.products = [];
    this.date = new Date().toLocaleString();
  }

  async deleteCartById(idEntered) {
    try {
      //! Lectura del archivo principal
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      //! Separar elementos que no coincidan con el id ingresado
      const leakedCartId = dataParsed.filter(({ id }) => id != idEntered);
      //! Separar el carro encontrado, para poder enviar una respuesta de "Carro no encontrado"
      const cartFound = dataParsed.find(({ id }) => id == idEntered);

      if (cartFound) {
        //! Si se encuentra el carro, se sobreescribe el archivo con el array leakedCartId
        console.log(`Se ha eliminado el carrito con id:${idEntered}`);
        const updatedFile = JSON.stringify(leakedCartId, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        //! Se devuelve el carro que se ha eliminado
        return cartFound;
      } else {
        //! Si no se encuentra el carro, se envía un mensaje por consola.
        console.log(`No se ha encontrado el carrito con id: ${idEntered}`);
      }
    } catch (error) {
      //! Error Handler
      console.error(`Se ha producido un error en deleteCartById: ${error}`);
    }
  }
}
```

### getCartById -

- Me permite listar todos los productos guardados en el carrito.

```javascript
class Cart {
  constructor(file) {
    this.file = file;
    this.products = [];
    this.date = new Date().toLocaleString();
  }

  async getCartById(idEntered) {
    try {
      //! Lectura del archivo principal
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      //! Encontrar carrito por ID
      const cartFound = dataParsed.find(({ id }) => id == idEntered);

      if (cartFound) {
        //! SI encontramos el carro, lo devolvemos
        console.log(`Se obtuvo el carrito ${idEntered}`);
        return cartFound;
      } else {
        //! Si no se encuentra el carro, retorna null
        console.log(`No se ha encontrado el carrito ${idEntered}`);
        return null;
      }
    } catch (error) {
      //! Error Handler
      console.error(`Se produjo un error en getCartById: ${error}`);
    }
  }
}
```

### addProductToCart -

- Para incorporar productos al carrito por su ID de producto.

```javascript
class Cart {
  constructor(file) {
    this.file = file;
    this.products = [];
    this.date = new Date().toLocaleString();
  }

  async addProductToCart(idEntered, object) {
    //! La función recibe un id por req.params y el id de producto por req.body
    try {
      //! Lectura del archivo principal
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      //! Se filtran los carritos que no corresponden con el ID proporcionado
      const leakedCartId = dataParsed.filter(({ id }) => id != idEntered);
      //! Se separa el carrito encontrado.
      const cartFound = dataParsed.find(({ id }) => id == idEntered);

      if (cartFound) {
        //! Si existe el carrito, se agrega el objeto nuevo obtenido por req-body.id
        cartFound.products.push(object);
        //! El método sort() ordenará los productos por su id, de menor a mayor
        cartFound.products.sort((a, b) => a.id - b.id);
        //! Se pushea al array principal de carritos el Carrito modificado y se lo ordena con sort()
        leakedCartId.push(cartFound);
        leakedCartId.sort((a, b) => a.id - b.id);
        //! Preparando el nuevo archivo para sobreescribir
        const updatedFile = JSON.stringify(leakedCartId, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        console.log(
          `Se ha agregado el producto ${object.title} exitosamente al carrito ${idEntered}`
        );
        //! REtorna el carrito encontrado y modificado
        return cartFound;
      } else {
        //! Si no encuentra el carro, devuelve null
        return null;
      }
    } catch (error) {
      //! Handler Error
      console.error(`Se produjo un error en addProductToCart:${error}`);
    }
  }
}
```

### deleteProductInCartById -

- Eliminar un producto del carrito, por su ID de producto y de carrito.

```javascript
class Cart {
  constructor(file) {
    this.file = file;
    this.products = [];
    this.date = new Date().toLocaleString();
  }

  async deleteProductInCartById(idCart, idProduct) {
    //! La función recibe dos id desde req.params, uno del carrito, y otro del producto a eliminar
    try {
      //! Lectura del archivo principal
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      //! Se separan los demás carritos que no se deben modificar
      const leakedCarts = dataParsed.filter(({ id }) => id != idCart);

      //! Se separa el carro a modificar
      const cartFound = dataParsed.find(({ id }) => id == idCart);
      //! Se aislan los productos del carro que no se deben modificar
      const leakedProducts = cartFound.products.filter(
        ({ id }) => id != idProduct
      );
      //! Se aisla el producto del carro a borrar
      const productFound = cartFound.products.find(({ id }) => id == idProduct);
//! Se sobreescribe el array de productos con el array con el producto filtrado, y se ordena con sort()
      cartFound.products = leakedProducts;
      cartFound.products.sort((a, b) => a.id - b.id);
      //! Se pushea al array principal de carritos, el array modificado en el paso anterior, y se ordena con sort()
      leakedCarts.push(cartFound);
      leakedCarts.sort((a, b) => a.id - b.id);
      //! Se sobreescribe el archivo ya modificado
      const updatedFile = JSON.stringify(leakedCarts, null, " ");
      fs.promises.writeFile(this.file, updatedFile);
//! retorna el producto modificado (eliminado)
      return productFound;
    } catch (error) {
      //! Error Handler
      console.error(`Se produjo un error en deleteProductInCartById:${error}`);
    }
  }
}
```
