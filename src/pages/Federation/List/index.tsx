import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Inputs/Button';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetFederations } from '../../../dataAccess/hooks/federation/useGetFederations';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { IFederation } from '../../../types/Federation';
import { ActionsButtons } from './ActionsButton';

const columns: ColumnDef<IFederation>[] = [
  {
    accessorKey: 'initials',
    header: 'Sigla',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'uf',
    header: 'Estado',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'presidentName',
    header: 'Presidente',
    cell: info => info.getValue(),
  },
  {
    header: '',
    accessorKey: 'id',
    cell: info => <ActionsButtons id={info.getValue() as string} />,
  },
];

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/4',
  'w-1/3 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell w-1/2 lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

export function FederationListPage() {
  useRedirectPendingAthlete();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('');
  const { data, isError, isLoading, isSuccess } = useGetFederations();

  let tableData = data || [];

  tableData = tableData.filter(federation =>
    federation.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de federação
        </h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar federação"
          onClick={() => navigate('/app/federacoes/cadastro')}
        />
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <TextfieldBare
            label="Buscar..."
            name="search"
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center mt-8">
          <p className="text-light-on-surface-variant text-xl">
            Buscando dados ...
          </p>
        </div>
      )}

      {isError && (
        <div className="text-center mt-8">
          <p className="text-light-on-error-container text-xl">
            Error ao buscar dados, tente novamente
          </p>
        </div>
      )}

      {isSuccess && data.length === 0 && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhuma federação cadastrada
        </p>
      )}

      {isSuccess && data.length > 0 && (
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    className={`${COLUMN_WIDTH[index]} text-left py-4 px-2 bg-slate-100`}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    className={`${COLUMN_WIDTH[index]} py-4 px-2`}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
