import { IUserData } from "@wavynode/utils";
import { defineHandler, getQuery } from "h3";

// give wavynode access to your user's data in batch
// GET /users?userIds=uuid1,uuid2,uuid3
export default defineHandler(async (e) => {
  const query = getQuery(e);
  if (!query.userIds) return [];

  const ids = (query.userIds as string).split(",");
  const users = await Promise.all(
    ids.map(async (id) => {
      try {
        return await getUser(id);
      } catch {
        return null;
      }
    }),
  );
  return users;
});

/**
 * Mock function for demonstration purposes
 */
const getUser = async (_userId: string): Promise<IUserData> => {
  return new Promise((resolve, _reject) => {
    const mockUserData: IUserData = {
      givenName: "Maria Guadalupe",
      maternalSurname: "Sánchez",
      paternalSurname: "Rodríguez",
      birthdate: "1992-05-15",
      nationality: "MX",
      phoneNumber: {
        countryCode: "+52",
        phoneNumber: 5512345678,
      },
      email: "maria.guadalupe@example.com",
      address: {
        country: "MX",
        region: "CDMX",
        city: "Ciudad de México",
        street: "Avenida Insurgentes Sur",
        colonia: "Condesa",
        exteriorNumber: "123",
        interiorNumber: "4B",
        postalCode: "06100",
      },
      mexico: {
        rfc: "ROSM920515XXX",
        curp: "ROSM920515MDFRXXXX",
        actividadEconomica: 612012,
        cuentaRelacionada: "1234567890",
        clabeInterbancaria: undefined,
        monedaCuentaRelacionada: 1,
        documentoIdentificacion: {
          tipoIdentificacion: 1,
          numeroIdentificacion: "IDMEX12345678",
        },
      },
    };
    resolve(mockUserData);
  });
};
