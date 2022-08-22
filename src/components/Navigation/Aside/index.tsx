import { FaUserAlt, FaUserFriends } from 'react-icons/fa';
import {
  MdChecklist,
  MdDashboard,
  MdFormatListBulleted,
  MdOutlineClose,
} from 'react-icons/md';
import { Divider } from '../../Divider';
import { IconButton } from '../../Inputs/IconButton';
import { ListItem } from './ListItem';
import { ListSubtitle } from './ListSubtitle';

interface IProps {
  isOpen: boolean;
  toogleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Aside({ isOpen, toogleSideMenu }: IProps) {
  const isOpenStyle = isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <aside
      className={`absolute duration-200 ease-in-out ${isOpenStyle} lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full h-full lg:relative lg:w-full lg:col-span-1 bg-light-background`}
    >
      <div className="bg-light-surface-1 flex flex-col h-full p-4 lg:rounded-3xl">
        <div className="flex justify-end mb-4 lg:hidden">
          <IconButton
            onClick={() => toogleSideMenu(false)}
            icon={MdOutlineClose}
          />
        </div>
        <ListItem href="/app/dashboard" label="Dashboard" icon={MdDashboard} />
        <Divider />
        <ListSubtitle label="Cadastros" />
        <ListItem
          href="/app/cadastros/atleta"
          label="Atletas"
          icon={FaUserAlt}
        />
        <ListItem
          href="/app/cadastros/usuario"
          label="Usuário do sistema"
          icon={FaUserFriends}
        />
        <Divider />
        <ListSubtitle label="Área restrita" />
        <ListItem
          href="/app/restrito/atletas"
          label="Listagem de atletas"
          icon={MdFormatListBulleted}
        />
        <ListItem
          href="/app/restrito/atletas/aprovacao"
          label="Aprovação de atletas"
          icon={MdChecklist}
        />
        <ListItem
          href="/app/restrito/atletas"
          label="Listagem de transferencias"
          icon={MdFormatListBulleted}
        />
        <ListItem
          href="/app/restrito/atletas/aprovacao"
          label="Aprovação de transferencias"
          icon={MdChecklist}
        />
      </div>
    </aside>
  );
}
