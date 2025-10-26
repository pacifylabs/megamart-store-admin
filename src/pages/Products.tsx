import { useState, useMemo, useCallback, useEffect } from "react";
import { essential, phones } from "../data/data";
import { PlusCircle, Edit, Trash, Search, Filter, X, Check } from "lucide-react";
import type { Product, EssentialItem } from "../types/product";
import { usePageTitle } from "../context/PageTitleContext";

type ProductCategory = 'phones' | 'essentials';

export default function Products() {
  const [currentCategory, setCurrentCategory] = useState<ProductCategory>('phones');
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Products');
  }, [setPageTitle]);
  const [allProducts, setAllProducts] = useState<{
    phones: Product[];
    essentials: Product[];
  }>({ phones, essentials: essential });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const itemsPerPage: number = 6;

  // Get current category products, filter, and paginate
  const { filteredProducts, paginatedProducts, totalPages, startIndex } = useMemo(() => {
    const categoryProducts = allProducts[currentCategory];
    
    // Filter products based on search query
    const filtered = !searchQuery.trim() 
      ? categoryProducts 
      : categoryProducts.filter(
          (product: Product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toString().includes(searchQuery)
        );
    
    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      filteredProducts: filtered,
      paginatedProducts: paginated,
      totalPages,
      startIndex
    };
  }, [allProducts, currentCategory, searchQuery, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handlePrev = useCallback((): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNext = useCallback((): void => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handleEdit = useCallback((product: Product): void => {
    setSelectedProduct(product);
    // TODO: Implement edit modal/form
    console.log("Edit product:", product);
  }, []);

  const handleDelete = useCallback((productId: number): void => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setAllProducts(prev => ({
        ...prev,
        [currentCategory]: prev[currentCategory].filter(p => p.id !== productId)
      }));
    }
  }, [currentCategory]);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    cut: '',
    save: '',
    discount: '',
    category: '',
    stock: 0,
    description: '',
    img: ''
  });

  const handleAddProduct = useCallback((): void => {
    setIsEditing(false);
    setNewProduct({
      name: '',
      price: '',
      cut: '',
      save: '',
      discount: '',
      category: currentCategory === 'phones' ? 'Phones' : 'Essentials',
      stock: 0,
      description: '',
      img: ''
    });
    setIsAddModalOpen(true);
  }, [currentCategory]);

  const handleEditProduct = useCallback((product: Product): void => {
    setIsEditing(true);
    setNewProduct({ ...product });
    setIsAddModalOpen(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'id' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && newProduct.id) {
      // Update existing product
      setAllProducts(prev => ({
        ...prev,
        [currentCategory]: prev[currentCategory].map(p => 
          p.id === newProduct.id ? { ...newProduct } as Product : p
        )
      }));
      alert('Product updated successfully!');
    } else {
      // Add new product
      const newId = Math.max(0, ...allProducts.phones.map(p => p.id), ...allProducts.essentials.map(p => p.id)) + 1;
      const productToAdd: Product = {
        ...newProduct as Omit<Product, 'id'>,
        id: newId,
        img: newProduct.img || 'default-product.jpg',
        stock: newProduct.stock || 0,
      };
      
      setAllProducts(prev => ({
        ...prev,
        [currentCategory]: [...prev[currentCategory], productToAdd]
      }));
      
      alert('Product added successfully!');
    }
    
    // Reset form and close modal
    setNewProduct({
      name: '',
      price: '',
      cut: '',
      save: '',
      discount: '',
      category: currentCategory === 'phones' ? 'Phones' : 'Essentials',
      stock: 0,
      description: '',
      img: ''
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1> */}
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage your {currentCategory} inventory
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Add Product
            </button>
          </div>

          {/* Add Product Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10">
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button 
                      onClick={() => setIsAddModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700 p-1 -mr-2"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitProduct} className="space-y-4 text-sm sm:text-base">
                    {isEditing && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product ID
                          </label>
                          <input
                            type="text"
                            name="id"
                            value={newProduct.id || ''}
                            disabled
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newProduct.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={newProduct.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="Phones">Phones</option>
                          <option value="Essentials">Essentials</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          name="img"
                          value={typeof newProduct.img === 'string' ? newProduct.img : ''}
                          onChange={handleInputChange}
                          placeholder="e.g., https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={newProduct.price}
                          onChange={handleInputChange}
                          placeholder="e.g. 32,999"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price (₹)
                        </label>
                        <input
                          type="text"
                          name="cut"
                          value={newProduct.cut}
                          onChange={handleInputChange}
                          placeholder="e.g. 40,999"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          You Save (₹)
                        </label>
                        <input
                          type="text"
                          name="save"
                          value={newProduct.save}
                          onChange={handleInputChange}
                          placeholder="e.g. 8,000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount
                        </label>
                        <input
                          type="text"
                          name="discount"
                          value={newProduct.discount}
                          onChange={handleInputChange}
                          placeholder="e.g. 50% OFF"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock *
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={newProduct.stock || ''}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sticky bottom-0 bg-white py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {isEditing ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setCurrentCategory('phones')}
              className={`px-4 py-2 font-medium text-sm ${
                currentCategory === 'phones'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Phones
            </button>
            <button
              onClick={() => setCurrentCategory('essentials')}
              className={`px-4 py-2 font-medium text-sm ${
                currentCategory === 'essentials'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Essentials
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${currentCategory} by name or ID...`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                aria-label="Search products"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product: Product, index: number) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                        {product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            Number(product.stock) > 50
                              ? "bg-green-100 text-green-800"
                              : Number(product.stock) > 20
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            aria-label={`Edit ${product.name}`}
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label={`Delete ${product.name}`}
                            title="Delete product"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Search className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1}
                  </span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  products
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}