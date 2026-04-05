import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
  User,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

import CustomerCreateDialog from '../features/customer/ui/CustomerCreateDialog';
import ClientsSearchToolbar from '../features/customer/ui/ClientsSearchToolbar';

import {
  getCustomersApi,
  getCustomerByIdApi,
  createCustomerApi,
} from '../features/customer/api/customerApi';

import { getAxiosErrorMessage, parseId } from '../utils/apiHelpers';
import { formatPhoneDisplay } from '../features/order/lib/phone';
import { toast } from 'sonner';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [paged, setPaged] = useState({
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = useCallback(
    async ({ page: pageArg, q, pageSize: pageSizeArg }) => {
      setLoading(true);
      setApiError('');

      try {
        const trimmed = String(q ?? '').trim();

        const data = await getCustomersApi({
          page: pageArg,
          pageSize: pageSizeArg,
          search: trimmed || undefined,
        });

        if (data?.code !== 0) {
          throw new Error(data?.message || 'API error');
        }

        const resp = data.response ?? data.responseBody;

        setPaged({
          items: resp?.items ?? [],
          page: resp?.page ?? pageArg,
          pageSize: resp?.pageSize ?? pageSizeArg,
          totalCount: resp?.totalCount ?? 0,
          totalPages: resp?.totalPages ?? 1,
        });
      } catch (err) {
        setApiError(getAxiosErrorMessage(err));
        setPaged((prev) => ({
          ...prev,
          items: [],
          page: 1,
          totalCount: 0,
          totalPages: 1,
        }));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCustomers({ page, q: appliedSearch, pageSize });
  }, [fetchCustomers, page, appliedSearch, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchQuery.trim();

      if (trimmed !== appliedSearch) {
        setPage(1);
        setAppliedSearch(trimmed);
      }

      if (!trimmed && appliedSearch !== '') {
        setPage(1);
        setAppliedSearch('');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, appliedSearch]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchQuery.trim());
  };

  const handlePageSizeChange = (value) => {
    const nextPageSize = Number(value);
    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleCreateCustomer = async (payload) => {
    try {
      setCreateLoading(true);

      const data = await createCustomerApi(payload);

      if (data?.code !== 0) {
        throw new Error(data?.message || 'Failed to create customer');
      }

      setIsCreateOpen(false);

      await fetchCustomers({
        page: 1,
        q: appliedSearch,
        pageSize,
      });

      setPage(1);

      return data.response ?? data.responseBody ?? true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create customer'
      );
      return null;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewCustomer = async (customerId) => {
    try {
      setViewLoading(true);
      setSelectedCustomer(null);
      setIsViewOpen(true);

      const data = await getCustomerByIdApi(customerId);

      if (data?.code !== 0) {
        throw new Error(data?.message || 'Failed to load customer');
      }

      setSelectedCustomer(data.response ?? data.responseBody ?? null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to load customer details'
      );
      setIsViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const customers = useMemo(() => paged.items ?? [], [paged.items]);

  const isIdSearch = parseId(appliedSearch) !== null;

  const canPrev = !isIdSearch && page > 1;
  const canNext = !isIdSearch && page < (paged.totalPages || 1);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Create and manage customers.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <ClientsSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClear={handleSearchClear}
          loading={loading}
          error={apiError}
        />

        <div className="w-full lg:w-auto">
          <CustomerCreateDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            loading={createLoading}
            onSubmit={handleCreateCustomer}
          >
            <Button
              variant="default"
              className="h-10 w-full lg:w-auto flex items-center gap-2 border border-border"
            >
              <Plus className="h-4 w-4" />
              Create Customer
            </Button>
          </CustomerCreateDialog>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-foreground">Customers</CardTitle>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Table Size
            </span>

            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Additional Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium text-foreground">
                      {customer.fullName || '—'}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {customer.phoneNumber
                        ? formatPhoneDisplay(customer.phoneNumber)
                        : '—'}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {customer.additionalPhoneNumber
                        ? formatPhoneDisplay(customer.additionalPhoneNumber)
                        : '—'}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted"
                          title="View"
                          onClick={() => handleViewCustomer(customer.id)}
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {paged.totalPages} • Total {paged.totalCount} • Showing up to {pageSize} rows
        </p>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="border-input"
            disabled={!canPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            className="bg-primary text-primary-foreground border-primary"
            disabled
          >
            {page}
          </Button>

          <Button
            size="sm"
            className="border-input"
            disabled={!canNext || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[560px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-foreground text-[20px] font-semibold">
              Customer Details
            </DialogTitle>
          </DialogHeader>

          {viewLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : selectedCustomer ? (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">
                      {selectedCustomer.fullName || '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium text-foreground">
                      {selectedCustomer.phoneNumber
                        ? formatPhoneDisplay(selectedCustomer.phoneNumber)
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Additional Phone</p>
                <p className="font-medium text-foreground mt-1">
                  {selectedCustomer.additionalPhoneNumber
                    ? formatPhoneDisplay(selectedCustomer.additionalPhoneNumber)
                    : '—'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Customer data not found
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}