import { useState } from "react";
import { addProduct } from "../firebase/firebase";
import { Product } from "./Home";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      description,
      price,
      images,
    };

    addProduct(newProduct,newProduct.id); 
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Product Image URLs"
        value={images.join(", ")}
        onChange={(e) => setImages(e.target.value.split(", "))}
      />
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default AddProductForm;
