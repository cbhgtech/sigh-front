import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/Inputs/Button';
import { FileInput } from '../../../../components/Inputs/FIleInput';
import { useGlobal } from '../../../../contexts/global.context';
import { usePutAthlete } from '../../../../dataAccess/hooks/athlete/usePutAthlete';
import { useAthletesRegister } from '../register.context';

export function DocumentationUpload() {
  const { user } = useGlobal();
  const { documents, setDocuments } = useAthletesRegister();
  const { mutateAsync } = usePutAthlete();

  const handleFileUpload = async () => {
    const birthDate = user?.athleteProfile?.birthDate;
    const isSubEighteen = dayjs().diff(birthDate, 'year') < 18;

    try {
      if (!documents.personalDocument)
        throw new Error('Documento pessoal obrigatório');

      if (isSubEighteen && !documents.commitmentTerm) {
        throw new Error('Termo de compromisso obrigatório');
      }

      // @ts-ignore
      await mutateAsync({
        ...user?.athleteProfile,
        documentFiles: {
          ...documents,
        },
        documents: {
          commitmentTerm: '',
          personalDocument: '',
          medicalCertificate: '',
          noc: '',
        },
      });

      toast.success('Documentos enviados com sucesso!');
    } catch (err) {
      // @ts-ignore
      toast.error(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="col-span-1">
        <FileInput
          name="document"
          label="Anexo Documento RG ou Passaporte"
          hint="Obrigatório para todos"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              personalDocument: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1">
        <FileInput
          name="document"
          label="Atestado Médico"
          hint="Obrigatório para todos"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              medicalCertificate: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1">
        <FileInput
          name="document"
          label="Termo de compromisso"
          hint="(obrigatório menores de idade)"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              commitmentTerm: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1">
        <FileInput
          name="document"
          label="N.O.C"
          hint="(Somente para atletas que atuam no exterior)"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              noc: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1 lg:col-span-2 mt-4">
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            label="Cancelar"
            variant="primary-border"
          />
          <Button
            type="button"
            aditionalClasses="w-auto px-2"
            label="Salvar"
            variant="primary"
            onClick={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
}
