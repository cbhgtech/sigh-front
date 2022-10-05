import {
  getDocs,
  collection,
  query,
  where,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { Roles } from '../../enums/Roles';
import { Status } from '../../enums/Status';
import { ITransfer } from '../../types/Transfer';
import { IUser } from '../../types/User';

export class DashboardController {
  public async getTotalizer() {
    const queryAthletes = query(
      collection(db, 'users'),
      where('role', '==', Roles.USER),
      where('status', '==', Status.ACTIVE),
    );
    const queryYearTransfers = query(
      collection(db, 'transfers'),
      where('status', '==', Status.ACTIVE),
      where('transferData', '>', new Date()),
    );

    const athletesDocs = await getDocs(queryAthletes);
    const teamDocs = await getDocs(collection(db, 'teams'));
    const yearTransfersDocs = await getDocs(queryYearTransfers);

    const totalAthletes = athletesDocs.size;
    const totalTeams = teamDocs.size;
    const totalTransfers = yearTransfersDocs.size;

    return {
      totalAthletes,
      totalTeams,
      totalTransfers,
    };
  }

  public async getLatestTransfers() {
    const queryLatestTransfers = query(collection(db, 'transfers'), limit(20));

    const latestTransfersDocs = await getDocs(queryLatestTransfers);

    const latestTransfers = latestTransfersDocs.docs.map(doc => ({
      ...(doc.data() as ITransfer),
      id: doc.id,
    }));

    return latestTransfers;
  }

  public async getLatestAthletes() {
    const queryLatestAthletes = query(
      collection(db, 'users'),
      where('role', '==', Roles.USER),
      where('status', '==', Status.ACTIVE),
      orderBy('updatedAt', 'desc'),
      limit(20),
    );

    const latestAthletesDocs = await getDocs(queryLatestAthletes);

    const latestAthletes = latestAthletesDocs.docs.map(doc => ({
      ...(doc.data() as IUser),
      id: doc.id,
    }));

    return latestAthletes;
  }
}
