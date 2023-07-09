import ticketsRepository from "@/repositories/tickets-repository";

async function getTickets(){
    return await ticketsRepository.getTicketTypes();
}

const ticketsService = {
    getTickets
};

export default ticketsService;