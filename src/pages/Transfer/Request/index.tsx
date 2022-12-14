import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import dayjs from 'dayjs';
import { Button } from '../../../components/Inputs/Button';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useGlobal } from '../../../contexts/global.context';
import { useGetCurrentConfigs } from '../../../dataAccess/hooks/configs/useGetConfigs';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { useCreateTransferRequest } from '../../../dataAccess/hooks/transfer/useCreateTransferRequest';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { DateService } from '../../../services/DateService';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';
import { Status } from '../../../enums/Status';
import { FileInput } from '../../../components/Inputs/FileInput';

interface IForm {
  transferData: string;
  obs: string;
  destinationClub: string;
}

interface IFile {
  federationPaymentVoucher: File | null;
  cbhgPaymentVoucher: File | null;
}

export function TransferRequestPage() {
  useRedirectPendingAthlete();
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { data, isLoading: isLoadingConfigs } = useGetCurrentConfigs();

  const { user } = useGlobal();
  const { mutateAsync } = useCreateTransferRequest();
  const { data: publicTeams, isLoading } = useGetPublicTeams();

  const [files, setFiles] = useState<IFile>({
    cbhgPaymentVoucher: null,
    federationPaymentVoucher: null,
  });

  const handeSubmit = async (data: IForm) => {
    if (!user) return;

    if (!files.cbhgPaymentVoucher)
      return toast.error('Comprovante de pagamento da CBHG ?? obrigat??rio');

    try {
      await validateForm(data, {
        transferData: Yup.string().required('Campo obrigat??rio'),
        obs: Yup.string(),
        destinationClub: Yup.string().required('Clube de destino obrigat??rio'),
      });

      const currentTeam = publicTeams?.list.find(t => t.id === user.relatedId);
      const team = publicTeams?.list.find(t => t.id === data.destinationClub);

      if (team?.id === user.relatedId) {
        throw new Error('Voc?? n??o pode transferir para o mesmo clube');
      }

      await mutateAsync({
        transferData: data.transferData,
        userId: user.id,
        currentTeamStatus: Status.PENDING,
        currentTeamId: user.relatedId,
        destinationTeamStatus: Status.PENDING,
        destinationTeamId: team!.id,
        currentFederationStatus: Status.PENDING,
        currentFederationId: currentTeam!.federationId!,
        destinationFederationStatus: Status.PENDING,
        destinationFederationId: team!.federationId!,
        obs: data.obs,
        documents: {
          cbhgPaymentVoucher: files.cbhgPaymentVoucher!,
          federationPaymentVoucher: files.federationPaymentVoucher,
        },
      });

      toast.success('Solicita????o enviada com sucesso!');

      navigate('/app/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      // @ts-ignore
      toast.error(err.message || 'Ops! Houve um erro ao criar a federa????o!');
    }
  };

  if (!isLoadingConfigs && data) {
    const { nextTransferPeriod, transferPeriodBegin, transferPeriodEnd } = data;

    const isTransferPeriod = DateService().isBetween(
      transferPeriodBegin.seconds,
      transferPeriodEnd.seconds,
    );

    const transferPeriodEnds = DateService().format(transferPeriodEnd.seconds);

    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        {!isTransferPeriod && (
          <>
            <h2 className="text-3xl text-light-on-surface mb-2">
              Solicita????o de Transfer??ncia
            </h2>
            <p>
              O pr??ximo per??odo de transfer??ncia come??a no dia{' '}
              {DateService().format(nextTransferPeriod.seconds)}{' '}
            </p>
          </>
        )}

        {isTransferPeriod && (
          <>
            <h2 className="text-3xl text-light-on-surface mb-2">
              Solicita????o de Transfer??ncia
            </h2>
            <p className="text-light-on-surface-variant">
              <strong>Aten????o!</strong> ?? obrigat??rio preencher todos os dados
              abaixo.
            </p>
            <p className="mb-8 text-light-on-surface-variant">
              O per??odo de transfer??ncia termina no dia{' '}
              <strong>{transferPeriodEnds}</strong>
            </p>
            <Form ref={formRef} onSubmit={data => handeSubmit(data)}>
              <Textfield
                type="date"
                label="Data real da solicita????o de transfer??ncia"
                name="transferData"
                value={dayjs().format('YYYY-MM-DD')}
                disabled
              />
              <Select name="destinationClub" label="Clube de destino">
                <option value="">Selecione um clube</option>
                {publicTeams &&
                  publicTeams.list.map(team => (
                    <option value={team.id}>{team.name}</option>
                  ))}
              </Select>
              <MultineTextfield name="obs" label="Observa????es" />

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="w-full">
                  <FileInput
                    name="federationPaymentVoucher"
                    label="Comprovante de pagamento do federa????o"
                    hint="Opcional"
                    onChange={e =>
                      setFiles({
                        ...files,
                        federationPaymentVoucher: e.target.files![0],
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <FileInput
                    name="cbhgPaymentVoucher"
                    label="Comprovante de pagamento da CBHG"
                    hint="Obrigat??rio"
                    onChange={e =>
                      setFiles({
                        ...files,
                        cbhgPaymentVoucher: e.target.files![0],
                      })
                    }
                  />
                </div>
              </div>

              <div className="col-span-6 lg:col-span-12 mt-4">
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    aditionalClasses="w-auto px-2 text-light-on-surface-variant"
                    label="Cancelar"
                    variant="primary-border"
                  />
                  <Button
                    type="submit"
                    aditionalClasses="w-auto px-2"
                    label="Fazer requisi????o"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </div>
    );
  }

  if (!isLoadingConfigs && !data) {
    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        <h2 className="text-center mt-8 text-light-on-surface-variant">
          Dados do per??odo de transfer??ncia n??o encontrados
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-center mt-8 text-light-on-surface-variant">
        Carregando periodo de transfer??ncia
      </h2>
    </div>
  );
}
