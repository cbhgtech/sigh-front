import { FaUserAlt, FaUserFriends, FaUsers, FaUsersCog } from 'react-icons/fa';
import {
  MdChecklist,
  MdCompareArrows,
  MdDashboard,
  MdGroups,
  MdGroupWork,
  MdInsertDriveFile,
  MdOutlineClose,
  MdOutlineListAlt,
  MdShield,
} from 'react-icons/md';
import { SiGoogleassistant } from 'react-icons/si';
import { Roles } from '../../../enums/Roles';
import { Divider } from '../../Divider';
import { IconButton } from '../../Inputs/IconButton';
import { ListItem } from './ListItem';
import { ListSubtitle } from './ListSubtitle';

import CBHGLogo from '../../../assets/cbhg-logo.png';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { useGlobal } from '../../../contexts/global.context';
import { Status } from '../../../enums/Status';

interface IProps {
  isOpen: boolean;
  toogleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Aside({ isOpen, toogleSideMenu }: IProps) {
  const isOpenStyle = isOpen ? 'translate-x-0' : '-translate-x-full';
  const { user } = useGlobal();

  const isAdmin = useHasPermission([Roles.ADMIN]);
  const isAthlete = useHasPermission([Roles.USER]);
  const isManager = useHasPermission([
    Roles.ADMIN,
    Roles.ADMINFEDERACAO,
    Roles.ADMINCLUBE,
  ]);

  return (
    <aside
      className={`absolute duration-200 ease-in-out ${isOpenStyle} lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full min-h-screen h-full lg:relative lg:w-full lg:col-span-1 bg-light-surface-1`}
    >
      <div className="bg-light-surface-1 overflow-y-auto flex flex-col min-h-screen h-full p-4 lg:rounded-3xl md:pb-20">
        <div className="flex justify-between mb-4 lg:hidden">
          <img
            className="w-20 object-contain"
            src={CBHGLogo}
            alt="Logo da Federação nacional de hoquei sobre grama"
          />

          <IconButton
            onClick={() => toogleSideMenu(false)}
            icon={MdOutlineClose}
          />
        </div>

        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/dashboard"
          label="Dashboard"
          icon={MdDashboard}
        />
        <Divider />
        <ListSubtitle label={isAdmin ? 'Cadastros' : 'Menu'} />
        {isAthlete && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/perfil"
            label="Meu perfil"
            icon={FaUserAlt}
          />
        )}
        {isAthlete && user?.status === Status.ACTIVE && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/transferencia/solicitacao"
            label="Transferências"
            icon={MdCompareArrows}
          />
        )}
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/atletas/listagem"
          label="Atletas"
          icon={FaUsers}
        />
        {isManager && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/tecnico/listagem"
            label="Comissão técnica"
            icon={FaUserFriends}
          />
        )}
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/oficial/listagem"
          label="Oficiais Técnicos"
          icon={MdGroups}
          end
        />
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/projetosparceiros/listagem"
          label="Projetos parceiros"
          icon={MdGroupWork}
        />

        {isAdmin && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/usuarios/listagem"
            label="Usuário do sistema"
            icon={FaUsersCog}
          />
        )}
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/clubes/listagem"
          label="Clubes"
          icon={MdShield}
        />
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/federacoes/listagem"
          label="Federações"
          icon={SiGoogleassistant}
        />
        {isManager && (
          <>
            <Divider />
            <ListSubtitle label="Área restrita" />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/restrito/atletas/aprovacao"
              label="Aprovação de atletas"
              icon={MdChecklist}
            />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/restrito/transferencia/listagem"
              label="Transferências"
              icon={MdOutlineListAlt}
              end
            />
          </>
        )}
        {isAdmin && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/restrito/atletas/relatorio"
            label="Relatório de atletas"
            icon={MdInsertDriveFile}
          />
        )}
      </div>
    </aside>
  );
}
