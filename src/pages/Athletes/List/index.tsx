/* eslint-disable no-console */
import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { useState } from 'react';
import { IconButton } from '../../../components/Inputs/IconButton';
import { SelectBare } from '../../../components/Inputs/SelectBare';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetAthletes } from '../../../dataAccess/hooks/athlete/useGetAllAthletes';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { useGetPublicFederations } from '../../../dataAccess/hooks/public/useGetPublicFederation';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { Roles } from '../../../enums/Roles';
import { ActionsButtons } from './ActionsButton';
import { UserCard } from '../../Dashboard/UserCard';
import { IUser } from '../../../types/User';
import { Status } from '../../../enums/Status';
import { checkIfAthleteIsActiveOrPending } from '../../../utils/checkIfAthleteIsActiveOrPending';

const COLUMN_WIDTH = [
  'w-1/2 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell w-1/2 lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

const COLUMN_NAMES = ['Nome', 'Clube', 'Sexo', 'Status', ''];

export function AthletesListPage() {
  useRedirectPendingAthlete();
  const { data, isLoading } = useGetAthletes();
  const { data: publicFederation } = useGetPublicFederations();
  const { data: publicTeams } = useGetPublicTeams();

  const [filter, setFilter] = useState('');
  const [filterFederation, setFilterFederation] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  let tableData = data || [];

  if (filterFederation) {
    const teamsFederation = publicTeams?.list
      .filter(team => team.federationId === filterFederation)
      .map(team => team.id);

    tableData = tableData.filter(athlete =>
      teamsFederation?.includes(athlete.relatedId),
    );
  }

  if (filterTeam) {
    tableData = tableData.filter(athlete => athlete.relatedId === filterTeam);
  }

  if (filter) {
    tableData = tableData.filter(athlete =>
      athlete.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  const renderUserStatus = (user: IUser) => {
    if (user.status !== Status.ACTIVE) return user.status;

    const realStatus = checkIfAthleteIsActiveOrPending(user);

    if (realStatus === 'Pending') return 'Pendente';

    return 'Ativo';
  };

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <div className="flex justify-start mb-4">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Listagem de atletas
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/4">
          <SelectBare
            label="Federação"
            name="federation-filter"
            onChange={e => setFilterFederation(e.target.value)}
          >
            <option value="">Todas</option>
            {publicFederation?.list.map(federation => (
              <option key={federation.id} value={federation.id}>
                {federation.name}
              </option>
            ))}
          </SelectBare>
        </div>

        <div className="w-full lg:w-1/4">
          <SelectBare
            label="Clube"
            name="team-filter"
            onChange={e => setFilterTeam(e.target.value)}
          >
            <option value="">Todos</option>
            {publicTeams?.list.map(team => (
              <option value={team.id} key={team.id}>
                {team.name}
              </option>
            ))}
          </SelectBare>
        </div>

        <div className="w-full lg:w-1/2">
          <TextfieldBare
            label="Buscar..."
            name="search"
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Buscando dados ...
        </p>
      )}

      {!isLoading && tableData.length === 0 && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhum atleta encontrado
        </p>
      )}

      {!isLoading && tableData.length > 0 && (
        <table className="w-full">
          <thead>
            <tr>
              {COLUMN_NAMES.map((name, index) => (
                <th
                  className={`${COLUMN_WIDTH[index]} text-left py-4 px-2 bg-slate-100`}
                  key={name}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map(athlete => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={athlete.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>
                  {athlete.name}
                </td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {athlete.related?.name || '-'}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {athlete.athleteProfile?.gender || '-'}
                </td>
                <td className={`${COLUMN_WIDTH[3]} py-4 px-2`}>
                  {renderUserStatus(athlete)}
                </td>
                <td className={`${COLUMN_WIDTH[4]} py-4 px-2`}>
                  <div className="flex gap-2 items-center justify-end">
                    <ActionsButtons id={athlete.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
