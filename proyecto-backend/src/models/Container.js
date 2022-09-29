const fs = require("fs");

class Container {
  constructor(file) {
    this.file = file;
  }

  async save(object) {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      const productFound = dataParsed.find(
        ({ title }) => title === object.title
      );

      if (productFound) {
        return null;
      } else {
        object.id = dataParsed.length + 1;
        dataParsed.push(object);
        const updatedFile = JSON.stringify(dataParsed, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        return object;
      }
    } catch (error) {
      console.error(`Se produjo un error en save:${error}`);
    }
  }

  async update(idEntered, object) {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      const leakedID = dataParsed.filter(({ id }) => id != idEntered);
      const productFound = dataParsed.find(({ id }) => id == idEntered);

      if (productFound) {
        const productFound = { ...object, id: idEntered };
        leakedID.push(productFound);
        const updatedFile = JSON.stringify(leakedID, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        console.log(`Producto ${idEntered} modificado con éxito`, productFound);
        return productFound;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Se produjo un error en update:${error}`);
    }
  }

  async getById(idEntered) {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      const idFound = dataParsed.find(({ id }) => id == idEntered);

      if (idFound) {
        console.log(`Se obtuvo el producto ${idFound.title}`);
        return idFound;
      } else {
        console.log("No se han encontrado productos");
      }
    } catch (error) {
      console.error(`Se produjo un error en getByID: ${error}`);
    }
  }

  async getAll() {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);

      if (dataParsed.length > 0) {
        return dataParsed;
      } else {
        console.log("No hay elementos disponibles");
      }
    } catch (error) {
      console.error(`Se ha producido un error en getAll: ${error}`);
    }
  }

  async deleteById(idEntered) {
    try {
      const dataToParse = await fs.promises.readFile(this.file, "utf-8");
      const dataParsed = JSON.parse(dataToParse);
      const leakedID = dataParsed.filter(({ id }) => id != idEntered);
      const idFound = dataParsed.find(({ id }) => id == idEntered);

      if (idFound) {
        console.log(
          `Se ha eliminado el objeto con id:${idEntered} >> [[${idFound.title}]]`
        );
        const updatedFile = JSON.stringify(leakedID, null, " ");
        fs.promises.writeFile(this.file, updatedFile);
        return idFound;
      } else {
        console.log(`No se ha encontrado el objeto con id: ${idEntered}`);
      }
    } catch (error) {
      console.error(`Se ha producido un error en deleteById: ${error}`);
    }
  }

  async deleteAll() {
    try {
      console.log("Todos los objetos fueron eliminados");
      await fs.promises.writeFile(this.file, "[]");
    } catch (error) {
      console.error(`Se ha producido un error en deleteAll: ${error}`);
    }
  }
}

module.exports = Container;
