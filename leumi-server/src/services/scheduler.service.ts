import { FireblocksService } from "./fireblocks/fireblocks.service";

export class SchedulerService {
  constructor(private readonly fireblocksService: FireblocksService) {}
  public reBalance() {}
  public staking() {}
}
