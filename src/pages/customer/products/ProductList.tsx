import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Container,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  Rating,
  IconButton,
  Drawer,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { getPublicProducts } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { ProductResponseDTO, ProductSearchCriteria } from '../../../types/product';
import { CategoryDTO } from '../../../types/category';
import { PaginatedResponse } from '../../../types/common';
import { getImageUrl } from '../../../utils/imageUtils';
import { debounce } from 'lodash';

const sortOptions = [
  { value: 'productName:asc', label: 'Name (A-Z)' },
  { value: 'productName:desc', label: 'Name (Z-A)' },
  { value: 'productPrice:asc', label: 'Price (Low to High)' },
  { value: 'productPrice:desc', label: 'Price (High to Low)' },
  { value: 'stockQuantity:desc', label: 'Stock (High to Low)' },
  { value: 'stockQuantity:asc', label: 'Stock (Low to High)' },
  { value: 'id:asc', label: 'Oldest First' },
  { value: 'id:desc', label: 'Newest First' },
];

interface FilterPanelProps {
  searchTerm: string;
  searchCriteria: ProductSearchCriteria;
  categories: CategoryDTO[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (event: SelectChangeEvent) => void;
  onCategoryChange: (event: SelectChangeEvent) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  searchCriteria,
  categories,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  onClose,
}) => (
  <Box sx={{ p: 3, width: 300 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6">Filters</Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    <Divider sx={{ mb: 2 }} />
    <FormControl fullWidth sx={{ mb: 2 }}>
      <TextField
        label="Search Products"
        variant="outlined"
        value={searchTerm}
        onChange={onSearchChange}
        autoComplete="off"
      />
    </FormControl>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Sort By</InputLabel>
      <Select value={searchCriteria.sort} onChange={onSortChange} label="Sort By">
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={searchCriteria.categoryId || 'all'}
        onChange={onCategoryChange}
        label="Category"
      >
        <MenuItem value="all">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id.toString()}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

const ProductList: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<ProductSearchCriteria>({
    page: 1,
    size: 12,
    sort: 'productName:asc',
    search: '',
  });

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const data = await categoryService.getAllPublicCategories();
      console.log('Categories response:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response: PaginatedResponse<ProductResponseDTO> =
        await getPublicProducts(searchCriteria);
      setProducts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchCriteria]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchCriteria((prev) => ({ ...prev, search: value, page: 1 }));
    }, 500),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSearchCriteria((prev) => ({ ...prev, sort: event.target.value, page: 1 }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchCriteria((prev) => ({ ...prev, page }));
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const categoryId = event.target.value;
    setSearchCriteria((prev) => ({
      ...prev,
      categoryId: categoryId === 'all' ? undefined : categoryId,
      page: 1,
    }));
  };

  const handleAddToCart = (productId: number) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', productId);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setIsFilterOpen(true)}
          variant="outlined"
        >
          Filter
        </Button>
      </Box>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  pt: 2,
                  px: 2,
                  backgroundColor: 'grey.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 280,
                }}
              >
                {product.imageList && product.imageList[0] && (
                  <Box
                    component="img"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 250,
                      objectFit: 'contain',
                    }}
                    src={getImageUrl(product.imageList[0].path)}
                    alt={product.imageList[0].altText || product.name}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Rating value={4.5} precision={0.5} readOnly sx={{ mb: 1 }} />
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  {product.price.toFixed(2)} zł
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddToCart(product.id)}
                  sx={{
                    backgroundColor: '#1a1a1a',
                    '&:hover': {
                      backgroundColor: '#333333',
                    },
                  }}
                >
                  ADD TO CART
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={searchCriteria.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Drawer anchor="right" open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterPanel
          searchTerm={searchTerm}
          searchCriteria={searchCriteria}
          categories={categories}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onCategoryChange={handleCategoryChange}
          onClose={() => setIsFilterOpen(false)}
        />
      </Drawer>
    </Container>
  );
};

export default ProductList;
