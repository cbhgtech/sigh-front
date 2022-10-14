import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Textfield } from '../../../components/Inputs/Textfield';
import { Select } from '../../../components/Inputs/Select';
import { FileInput } from '../../../components/Inputs/FIleInput';
import { validateForm } from '../../../utils/validateForm';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { useCreateTechnicalComittee } from '../../../dataAccess/hooks/technicalComittee/useCreateTechnicalComittee';
import { useGlobal } from '../../../contexts/global.context';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { Roles } from '../../../enums/Roles';
import { Button } from '../../../components/Inputs/Button';

interface IForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
}

export function TechnicalCommitteeRegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);

  const { user } = useGlobal();
  const { mutateAsync, isLoading } = useCreateTechnicalComittee();
  const isTeamManager = useHasPermission([Roles.ADMINCLUBE]);

  const [document, setDocument] = useState<File | null>(null);

  async function handleSubmit(data: IForm) {
    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        phone: Yup.string().required('Celular obrigatório'),
        birthDate: Yup.date().required('Data de nascimento obrigatória'),
        gender: Yup.string().required('Gênero obrigatório'),
        email: Yup.string().required('Email obrigatório'),
      });

      if (!document) {
        toast.error('É necessário enviar o documento de identificação');
        return;
      }

      await mutateAsync({
        ...data,
        relatedId: user!.relatedId,
        documentFile: document,
      });

      toast.success('Comissão técnica criada com sucesso');

      navigate('/app/tecnico/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Não foi possivel salvar dados!');
    }
  }

  if (!isTeamManager) {
    toast.warning('Você não tem permissão para acessar essa página');
    navigate('/app/tecnico/listagem');
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">Comissão Técnica</h2>
      <Form
        ref={formRef}
        onSubmit={data => handleSubmit(data)}
        className="flex flex-col"
      >
        <div className="flex-1">
          <Textfield name="name" label="Nome" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield name="phone" label="Telefone" />
          </div>
          <div className="col-span-1">
            <Textfield
              type="date"
              name="birthDate"
              label="Data de nascimento"
            />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield type="email" name="email" label="Email" />
          </div>
          <div className="col-span-1">
            <Select name="gender" label="Sexo*">
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </Select>
          </div>
        </div>
        <div className="flex-1">
          <Textfield name="document" label="Número do documento" />
        </div>
        <div className="p-4">
          <FileInput
            name="document"
            label="Atestado Médico"
            hint="Obrigatório para todos"
            onChange={e => setDocument(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            label="Cancelar"
            variant="primary-border"
            type="button"
            onClick={() => navigate('/app/tecnico/listagem')}
          />
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            label="Salvar"
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </Form>
    </div>
  );
}